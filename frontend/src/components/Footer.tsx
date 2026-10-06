import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { darkMode } = useTheme();
  const { t } = useTranslation('common');
  
  return (
    <footer className={`${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-200 text-gray-700'} py-8 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h2 className="font-bold text-xl mb-4 text-primary">{t('footer.aboutTitle')}</h2>
            <p className="text-sm">
              {t('footer.aboutText')}
            </p>
          </div>

          {/* Account Section */}
          <div>
            <h2 className="font-bold text-xl mb-4 text-primary">{t('footer.accountTitle')}</h2>
            <ul className="space-y-2">
              <li><Link to="/cart" className="hover:text-primary">{t('footer.myCart')}</Link></li>
              <li><Link to="/cart" className="hover:text-primary">{t('footer.checkout')}</Link></li>
              <li><a href="#" className="hover:text-primary">{t('footer.shoppingDetails')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.order')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.helpCenter')}</a></li>
            </ul>
          </div>

          {/* Helpful Links Section */}
          <div>
            <h2 className="font-bold text-xl mb-4 text-primary">{t('footer.helpfulLinksTitle')}</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">{t('footer.services')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.supports')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.feedback')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.termsAndConditions')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.privacyPolicy')}</a></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h2 className="font-bold text-xl mb-4 text-primary">{t('footer.socialMediaTitle')}</h2>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">{t('footer.twitter')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.facebook')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.youtube')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.linkedin')}</a></li>
              <li><a href="#" className="hover:text-primary">{t('footer.instagram')}</a></li>
            </ul>
          </div>
        </div>

        <div className={`mt-8 pt-8 ${darkMode ? 'border-gray-700' : 'border-gray-300'} border-t text-center text-sm transition-colors duration-300`}>
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;