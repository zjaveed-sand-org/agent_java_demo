# Documentation Guidelines

## Project Documentation

This folder contains documentation for the OctoCAT Supply Chain Management application.

## Language Requirements

**All documentation must be provided in both English and German.**

### Language Standards

- **English**: Use clear, professional technical English suitable for international audiences
- **German**: Use formal technical German (Sie-Form) unless otherwise specified
- Maintain consistency in terminology across both languages
- Create language-specific versions using file suffixes: `-en.md` (English) and `-de.md` (German)
- For single-file bilingual documents, use clear section headers: `## English` and `## Deutsch`

### Translation Best Practices

- Translate technical terms appropriately while maintaining industry-standard terminology
- Keep code examples, commands, and API endpoints identical in both languages
- Ensure diagrams and visual content work for both language audiences
- Update both language versions simultaneously when making changes
- Use consistent formatting and structure across language versions

### Terminology Consistency

Maintain a glossary of key technical terms:
- Supply Chain → Lieferkette
- API → API (unchanged)
- Database → Datenbank
- Deployment → Bereitstellung
- Repository → Repository (unchanged)
- Build → Build (unchanged)
- Test → Test (unchanged)

## Documentation Standards

- Use clear, concise language suitable for both technical and non-technical audiences
- Include code examples where appropriate
- Keep diagrams up-to-date using Mermaid format
- Follow the existing document structure and formatting

## Key Documents

- `architecture.md`: System architecture and ERD diagrams
- `build.md`: Build, run, and test instructions
- `deployment.md`: Deployment guides and procedures
- `demo-script.md`: Demo walkthrough scripts
- `model-comparison.md`: Model comparison documentation
- `tao.md`: TAO observability documentation

## When Writing Documentation

- Always create or update both English and German versions
- Verify commands and code snippets work as documented
- Update architecture diagrams when system components change
- Include prerequisites and environment setup details
- Provide troubleshooting sections for common issues in both languages
- Cross-reference related documents when appropriate

## File Naming Conventions

For bilingual documentation:
```
architecture-en.md          # English version
architecture-de.md          # German version
```

Or use a single file with clear language sections:
```markdown
# Architecture / Architektur

## English
[English content here]

## Deutsch
[German content here]
```

## Mermaid Diagrams

Use Mermaid for:
- ERD diagrams to show entity relationships
- Flowcharts for architectural components
- Sequence diagrams for API interactions

**Note**: Diagram labels should be in English for technical consistency, with translations in surrounding text if needed.

## Quality Checklist

Before finalizing documentation:
- [ ] Both English and German versions are complete
- [ ] Technical terms are translated consistently
- [ ] Code examples are identical in both versions
- [ ] All links and references work in both versions
- [ ] Formatting is consistent across languages
- [ ] Diagrams are up-to-date and referenced correctly
- [ ] Grammar and spelling checked in both languages
