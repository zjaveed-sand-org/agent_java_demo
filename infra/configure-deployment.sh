#!/bin/bash

# Script to configure deployment environment in Azure and Environments/Variables for Actions
# Usage: ./configure-deployment.sh <github-org>/<github-repo> [resource-group-staging] [resource-group-prod] [location-staging] [location-prod]

# Environment names - used for both GitHub environments and OIDC configuration
ENV_STAGING="Staging"
ENV_PROD="Production"

# Check if repository name is provided
if [ $# -lt 1 ]; then
    echo "Usage: $0 <github-org>/<github-repo> [resource-group-staging] [resource-group-prod] [location-staging] [location-prod]"
    echo "Example: $0 octodemo/glowing-acorn rg-octocat-staging rg-octocat-prod eastus2 eastus2"
    exit 1
fi

REPO=$1
ORG=$(echo $REPO | cut -d'/' -f1)
REPO_NAME=$(echo $REPO | cut -d'/' -f2)
SP_NAME="${REPO_NAME}-github-actions"

# Default resource group names and locations if not provided
RG_STAGING=${2:-"${REPO_NAME}-staging"}
RG_PROD=${3:-"${REPO_NAME}-prod"}
LOCATION_STAGING=${4:-"eastus2"}
LOCATION_PROD=${5:-"eastus2"}

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed. Please install it to set repository variables."
    echo "   Installation instructions: https://cli.github.com/manual/installation"
    HAS_GH_CLI=false
else
    echo "✅ GitHub CLI is installed."
    HAS_GH_CLI=true
    
    # Check if authenticated with GitHub
    if ! gh auth status &> /dev/null; then
        echo "🔐 Not logged in to GitHub. Please authenticate:"
        gh auth login
    else
        echo "✅ Already authenticated with GitHub"
    fi
    
    # Get current GitHub user for environment approval - don't use --silent with jq
    echo "🔍 Getting GitHub user information..."
    GITHUB_USER=$(gh api user | jq -r '.login')
    if [ -n "$GITHUB_USER" ]; then
        echo "✅ Current GitHub user: $GITHUB_USER"
    else
        echo "⚠️ Could not determine GitHub user. Will use empty reviewer list for environments."
        GITHUB_USER=""
    fi
    
    # Check if the repository exists and is accessible
    if ! gh repo view $REPO &> /dev/null; then
        echo "⚠️  Unable to access repository $REPO. Please check if it exists and you have access."
        echo "    Will not set GitHub repository variables automatically."
        HAS_REPO_ACCESS=false
    else
        echo "✅ Repository $REPO is accessible"
        HAS_REPO_ACCESS=true
    fi
fi

# Check if already logged in to Azure
echo "🔍 Checking if already logged in to Azure..."
ACCOUNT_CHECK=$(az account show 2>/dev/null)
LOGIN_STATUS=$?

if [ $LOGIN_STATUS -ne 0 ]; then
    echo "🔐 Not logged in. Initiating Azure login..."
    az login
else
    echo "✅ Already logged in to Azure"
fi

echo "🔍 Getting subscription information..."
SUBSCRIPTION_ID=$(az account show --query id -o tsv 2>/dev/null)
SUBSCRIPTION_NAME=$(az account show --query name -o tsv 2>/dev/null)
TENANT_ID=$(az account show --query tenantId -o tsv 2>/dev/null)

# Validate that we have subscription information
if [ -z "$SUBSCRIPTION_ID" ] || [ -z "$TENANT_ID" ]; then
    echo "❌ Error: Could not retrieve subscription information. Please ensure you're logged in to Azure."
    echo "   Try running: az login"
    exit 1
fi

echo "📊 Using the following Azure subscription:"
echo "   Subscription ID: $SUBSCRIPTION_ID"
echo "   Subscription Name: $SUBSCRIPTION_NAME"
echo "   Tenant ID: $TENANT_ID"

# Verify subscription access
echo "🔍 Verifying subscription access..."
if ! az account show --subscription "$SUBSCRIPTION_ID" &>/dev/null; then
    echo "❌ Error: Cannot access subscription $SUBSCRIPTION_ID"
    echo "   Please check your Azure permissions and try again."
    exit 1
fi
echo "✅ Subscription access verified"

# Create or check resource groups
create_resource_group() {
    local rg_name=$1
    local location=$2
    local env=$3

    echo "🔍 Checking if resource group '$rg_name' exists..."
    RG_EXISTS=$(az group exists --name $rg_name)

    if [ "$RG_EXISTS" = "true" ]; then
        echo "✅ Resource group '$rg_name' already exists"
    else
        echo "🏗️ Creating resource group '$rg_name' in '$location'..."
        az group create --name $rg_name --location $location --tags environment=$env application=OctoCAT-SupplyChain > /dev/null
        echo "✅ Resource group '$rg_name' created successfully"
    fi
}

# Create resource groups
echo ""
echo "🏗️ Creating Azure resource groups..."
create_resource_group $RG_STAGING $LOCATION_STAGING "staging"
create_resource_group $RG_PROD $LOCATION_PROD "production"

# Check if service principal already exists
echo "🔍 Checking if service principal '$SP_NAME' already exists..."
SP_CHECK=$(az ad sp list --filter "displayName eq '$SP_NAME'" --query "[].appId" -o tsv)

if [ -z "$SP_CHECK" ]; then
    echo "🔑 Creating new service principal '$SP_NAME'..."
    
    # Create the Azure AD application first (or get existing)
    APP_CHECK=$(az ad app list --filter "displayName eq '$SP_NAME'" --query "[0].appId" -o tsv)
    
    if [ -z "$APP_CHECK" ]; then
        # Create new app if it doesn't exist
        CLIENT_ID=$(az ad app create --display-name "$SP_NAME" --query appId -o tsv)
        echo "✅ Created new Azure AD application with ID: $CLIENT_ID"
    else
        # Use existing app
        CLIENT_ID=$APP_CHECK
        echo "ℹ️ Using existing Azure AD application with ID: $CLIENT_ID"
    fi
    
    # Check if service principal exists for this app
    SP_EXISTS=$(az ad sp list --filter "appId eq '$CLIENT_ID'" --query "[0].appId" -o tsv)
    
    if [ -z "$SP_EXISTS" ]; then
        # Create the service principal without credentials
        az ad sp create --id "$CLIENT_ID" > /dev/null
        echo "✅ Created service principal for app ID: $CLIENT_ID"
    else
        echo "ℹ️ Service principal already exists for app ID: $CLIENT_ID"
    fi
    
    # Assign the contributor role at subscription level
    ROLE_EXISTS=$(az role assignment list --assignee "$CLIENT_ID" --role contributor --scope /subscriptions/$SUBSCRIPTION_ID --query "[0].id" -o tsv)
    if [ -z "$ROLE_EXISTS" ]; then
        az role assignment create \
            --assignee "$CLIENT_ID" \
            --role contributor \
            --scope /subscriptions/$SUBSCRIPTION_ID > /dev/null
        echo "✅ Assigned Contributor role at subscription level"
    else
        echo "ℹ️ Contributor role already assigned at subscription level"
    fi
    
    echo "✅ Service principal setup complete with ID: $CLIENT_ID (no client secret - using OIDC only)"
else
    echo "ℹ️ Service principal '$SP_NAME' already exists with ID: $SP_CHECK"
    CLIENT_ID=$SP_CHECK
fi

# Register Microsoft.ContainerRegistry provider if not already registered
echo "🔍 Checking if Microsoft.ContainerRegistry provider is registered..."
PROVIDER_STATUS=$(az provider show --namespace Microsoft.ContainerRegistry --query registrationState -o tsv 2>/dev/null)

if [ "$PROVIDER_STATUS" != "Registered" ]; then
    echo "🔧 Registering Microsoft.ContainerRegistry provider..."
    az provider register --namespace Microsoft.ContainerRegistry > /dev/null
    echo "⏳ Waiting for provider registration to complete..."
    while [ "$(az provider show --namespace Microsoft.ContainerRegistry --query registrationState -o tsv)" != "Registered" ]; do
        echo "   Still waiting for provider registration..."
        sleep 10
    done
    echo "✅ Microsoft.ContainerRegistry provider registered successfully"
else
    echo "✅ Microsoft.ContainerRegistry provider already registered"
fi

# Create Azure Container Registry in production resource group
# Remove hyphens and convert to lowercase for ACR name, ensure it's at least 5 characters
ACR_NAME=$(echo "${REPO_NAME}" | tr -d '-' | tr -d '_' | tr '[:upper:]' '[:lower:]')
# Ensure ACR name is at least 5 characters and only contains alphanumeric characters
if [ ${#ACR_NAME} -lt 5 ]; then
    ACR_NAME="${ACR_NAME}acr"
fi
# Remove any non-alphanumeric characters
ACR_NAME=$(echo "$ACR_NAME" | sed 's/[^a-zA-Z0-9]//g')
# if longer than 35 chars, trim
if [ ${#ACR_NAME} -gt 35 ]; then
    ACR_NAME=$(echo "$ACR_NAME" | cut -c1-35)
fi

echo "🔍 Checking if Azure Container Registry '$ACR_NAME' exists..."
ACR_EXISTS=$(az acr check-name --name $ACR_NAME --query 'nameAvailable' -o tsv)

if [ "$ACR_EXISTS" = "true" ]; then
    echo "🏗️ Creating Azure Container Registry '$ACR_NAME' in resource group '$RG_PROD'..."
    az acr create \
        --resource-group $RG_PROD \
        --name $ACR_NAME \
        --sku Basic \
        --admin-enabled false \
        --location $LOCATION_PROD > /dev/null
    
    echo "✅ Azure Container Registry created successfully"
else
    echo "ℹ️ Azure Container Registry '$ACR_NAME' already exists"
fi

echo "🔑 Update admin-enabled for ACR..."
az acr update -n $ACR_NAME --admin-enabled true > /dev/null
echo "✅ Admin access enabled for Azure Container Registry '$ACR_NAME'"

# Grant ACR access to the service principal
echo "🔑 Granting AcrPull role to service principal for ACR..."
SP_OBJECT_ID=$(az ad sp show --id $CLIENT_ID --query id -o tsv)
if [ -z "$SP_OBJECT_ID" ]; then
    echo "❌ Error: Could not retrieve service principal object ID"
    exit 1
fi

ACR_SCOPE="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG_PROD/providers/Microsoft.ContainerRegistry/registries/$ACR_NAME"
if az role assignment create \
    --assignee-object-id $SP_OBJECT_ID \
    --assignee-principal-type ServicePrincipal \
    --role AcrPull \
    --scope "$ACR_SCOPE" > /dev/null 2>&1; then
    echo "✅ AcrPull role assigned successfully"
else
    echo "⚠️ Warning: Failed to assign AcrPull role (may already exist)"
fi

# Assign role to specific resource groups
echo "🔑 Assigning Contributor role to service principal for resource group '$RG_STAGING'..."
RG_STAGING_SCOPE="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG_STAGING"
if az role assignment create \
    --assignee-object-id $SP_OBJECT_ID \
    --assignee-principal-type ServicePrincipal \
    --role Contributor \
    --scope "$RG_STAGING_SCOPE" > /dev/null 2>&1; then
    echo "✅ Contributor role assigned to staging resource group successfully"
else
    echo "⚠️ Warning: Failed to assign Contributor role to staging resource group (may already exist)"
fi

echo "🔑 Assigning Contributor role to service principal for resource group '$RG_PROD'..."
RG_PROD_SCOPE="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG_PROD"
if az role assignment create \
    --assignee-object-id $SP_OBJECT_ID \
    --assignee-principal-type ServicePrincipal \
    --role Contributor \
    --scope "$RG_PROD_SCOPE" > /dev/null 2>&1; then
    echo "✅ Contributor role assigned to production resource group successfully"
else
    echo "⚠️ Warning: Failed to assign Contributor role to production resource group (may already exist)"
fi

# Assign User Access Administrator role to allow role assignments
echo "🔑 Assigning User Access Administrator role to service principal for resource groups..."
if az role assignment create \
    --assignee-object-id $SP_OBJECT_ID \
    --assignee-principal-type ServicePrincipal \
    --role "User Access Administrator" \
    --scope "$RG_STAGING_SCOPE" > /dev/null 2>&1; then
    echo "✅ User Access Administrator role assigned to staging resource group successfully"
else
    echo "⚠️ Warning: Failed to assign User Access Administrator role to staging resource group (may already exist)"
fi

if az role assignment create \
    --assignee-object-id $SP_OBJECT_ID \
    --assignee-principal-type ServicePrincipal \
    --role "User Access Administrator" \
    --scope "$RG_PROD_SCOPE" > /dev/null 2>&1; then
    echo "✅ User Access Administrator role assigned to production resource group successfully"
else
    echo "⚠️ Warning: Failed to assign User Access Administrator role to production resource group (may already exist)"
fi

# Function to create federated credential if it doesn't exist
create_federated_credential() {
    local name=$1
    local subject=$2
    local description=$3
    
    echo "🔍 Checking if federated credential '$name' already exists..."
    CRED_EXISTS=$(az ad app federated-credential list --id "$CLIENT_ID" --query "[?name=='$name'].name" -o tsv)
    
    if [ -z "$CRED_EXISTS" ]; then
        echo "🔗 Creating federated credential '$name'..."
        az ad app federated-credential create \
            --id "$CLIENT_ID" \
            --parameters "{\"name\":\"$name\",\"issuer\":\"https://token.actions.githubusercontent.com\",\"subject\":\"$subject\",\"description\":\"$description\",\"audiences\":[\"api://AzureADTokenExchange\"]}" > /dev/null
        echo "✅ Federated credential '$name' created successfully"
    else
        echo "ℹ️ Federated credential '$name' already exists, skipping creation"
    fi
}

# Create federated credentials for different GitHub workflows and environments
create_federated_credential "${ORG}-${REPO_NAME}-${ENV_STAGING}" "repo:${ORG}/${REPO_NAME}:environment:${ENV_STAGING}" "GitHub Actions for deploying to staging environment"
create_federated_credential "${ORG}-${REPO_NAME}-${ENV_PROD}" "repo:${ORG}/${REPO_NAME}:environment:${ENV_PROD}" "GitHub Actions for deploying to production environment"
create_federated_credential "${ORG}-${REPO_NAME}-main" "repo:${ORG}/${REPO_NAME}:ref:refs/heads/main" "GitHub Actions for main branch workflows"

# Function to create or update GitHub variables
set_github_variable() {
    local var_name=$1
    local var_value=$2
    
    if [ "$HAS_GH_CLI" = true ] && [ "$HAS_REPO_ACCESS" = true ]; then
        echo "🔧 Setting GitHub variable: $var_name"
        if gh variable set "$var_name" -b "$var_value" -R "$REPO" &> /dev/null; then
            echo "✅ Successfully set GitHub variable: $var_name"
        else
            echo "⚠️ Failed to set GitHub variable: $var_name"
        fi
    fi
}

# Create GitHub environments if they don't exist
create_github_environment() {
    local env_name=$1
    local require_approval=$2
    
    if [ "$HAS_GH_CLI" = true ] && [ "$HAS_REPO_ACCESS" = true ]; then
        echo "🏗️ Checking if environment '$env_name' exists..."
        ENV_DATA=$(gh api repos/$REPO/environments)
        ENV_EXISTS=$(echo "$ENV_DATA" | jq -r --arg env "$env_name" '.environments[] | select(.name == $env) | .name' 2>/dev/null)
        
        if [ -z "$ENV_EXISTS" ]; then
            echo "🏗️ Creating GitHub environment: $env_name"
            
            # Create initial JSON for environment creation
            JSON_PAYLOAD='{
                "wait_timer": 0,
                "reviewers": [],
                "deployment_branch_policy": null
            }'
            
            # Create the environment first with proper JSON formatting
            gh api repos/$REPO/environments/$env_name \
                -X PUT \
                -H "Content-Type: application/json" \
                --input - <<< "$JSON_PAYLOAD" > /dev/null
        else
            echo "ℹ️ Environment '$env_name' already exists"
        fi
        
        if [ "$require_approval" = true ] && [ -n "$GITHUB_USER" ]; then
            # Add the current user as a required reviewer
            echo "🔒 Setting up environment '$env_name' with approval required from $GITHUB_USER"
            
            # Get the user's ID first
            USER_DATA=$(gh api users/$GITHUB_USER)
            USER_ID=$(echo "$USER_DATA" | jq -r '.id')
            
            if [ -n "$USER_ID" ]; then
                # Update environment settings with approval requirements
                APPROVAL_JSON="{
                    \"wait_timer\": 0,
                    \"reviewers\": [
                        {
                            \"type\": \"User\",
                            \"id\": $USER_ID
                        }
                    ],
                    \"deployment_branch_policy\": null
                }"
                
                # Update the environment settings
                gh api repos/$REPO/environments/$env_name \
                    -X PUT \
                    -H "Content-Type: application/json" \
                    --input - <<< "$APPROVAL_JSON" > /dev/null
                
                echo "✅ Environment '$env_name' configured with $GITHUB_USER as required reviewer"
            else
                echo "⚠️ Could not get user ID for $GITHUB_USER, environment created without reviewers"
            fi
        else
            # For non-approval environments, ensure no reviewers are set
            NO_APPROVAL_JSON='{
                "wait_timer": 0,
                "reviewers": [],
                "deployment_branch_policy": null
            }'
            
            gh api repos/$REPO/environments/$env_name \
                -X PUT \
                -H "Content-Type: application/json" \
                --input - <<< "$NO_APPROVAL_JSON" > /dev/null
            
            echo "✅ Environment '$env_name' configured without approval requirements"
        fi
    fi
}

# Set GitHub repository variables if GitHub CLI is available and repository is accessible
if [ "$HAS_GH_CLI" = true ] && [ "$HAS_REPO_ACCESS" = true ]; then
    echo ""
    echo "🔧 Setting GitHub repository variables..."
    set_github_variable "AZURE_CLIENT_ID" "$CLIENT_ID"
    set_github_variable "AZURE_TENANT_ID" "$TENANT_ID"
    set_github_variable "AZURE_SUBSCRIPTION_ID" "$SUBSCRIPTION_ID"
    set_github_variable "AZURE_RESOURCE_GROUP" "$RG_STAGING"
    set_github_variable "AZURE_RESOURCE_GROUP_PROD" "$RG_PROD"
    set_github_variable "AZURE_ACR_NAME" "$ACR_NAME"
    echo "✅ GitHub repository variables have been set"
    
    echo ""
    echo "🏗️ Creating GitHub environments..."
    create_github_environment "$ENV_STAGING" false
    create_github_environment "$ENV_PROD" true
    echo "✅ GitHub environments have been created"
else
    echo ""
    echo "⚠️ GitHub repository variables and environments were not set automatically"
fi

echo ""
echo "✅ Setup completed successfully! Here's what was done:"
echo "-------------------------------"
echo "✓ Created or verified Azure resource groups:"
echo "  - $RG_STAGING (in $LOCATION_STAGING)"
echo "  - $RG_PROD (in $LOCATION_PROD)"
echo "✓ Created or verified Azure Container Registry:"
echo "  - $ACR_NAME (in $RG_PROD)"
echo "✓ Created or verified service principal"
echo "✓ Configured OIDC federated credentials"
echo "✓ Set up GitHub repository variables (if GitHub CLI was available)"
echo "✓ Created GitHub environments (if GitHub CLI was available):"
echo "  - $ENV_STAGING (no approval required)"
if [ -n "$GITHUB_USER" ]; then
    echo "  - $ENV_PROD (with approval required from $GITHUB_USER)"
else
    echo "  - $ENV_PROD (with required approval)"
fi
echo ""
echo "📋 GitHub Actions Variables:"
echo "-------------------------------"
echo "AZURE_CLIENT_ID: $CLIENT_ID"
echo "AZURE_TENANT_ID: $TENANT_ID"
echo "AZURE_SUBSCRIPTION_ID: $SUBSCRIPTION_ID"
echo "AZURE_RESOURCE_GROUP: $RG_STAGING"
echo "AZURE_RESOURCE_GROUP_PROD: $RG_PROD"
echo "AZURE_ACR_NAME: $ACR_NAME"
echo ""

if [ "$HAS_GH_CLI" = false ] || [ "$HAS_REPO_ACCESS" = false ]; then
    echo "⚠️ You need to manually create these variables in your GitHub repository settings"
    echo "   Go to: https://github.com/$REPO/settings/variables/actions"
    echo ""
    echo "⚠️ You also need to manually create environments in your GitHub repository settings:"
    echo "   1. Go to: https://github.com/$REPO/settings/environments"
    echo "   2. Create '$ENV_STAGING' environment (no protection rules)"
    echo "   3. Create '$ENV_PROD' environment (with required reviewers)"
fi

echo "🚀 Your deployment infrastructure is now fully set up!"
echo "🔒 No client secrets were created - secure OIDC authentication will be used instead"