import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { unitPriceCents } from '../context/cart';
import { useTheme } from '../context/ThemeContext';

export default function Cart() {
  const { items, itemCount, subtotal, shipping, total, storageError, changeQuantity, removeItem } = useCart();
  const { darkMode } = useTheme();
  const { t, i18n } = useTranslation();
  const formatPrice = (cents: number) => new Intl.NumberFormat(i18n.resolvedLanguage, {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
  const surface = darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800';
  const muted = darkMode ? 'text-gray-300' : 'text-gray-600';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen px-4 pb-16 pt-24 ${darkMode ? 'bg-dark text-light' : 'bg-gray-100 text-gray-800'}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-3xl font-bold">{t('cart.title')}</h1>
          <span className={`text-sm ${muted}`}>{t('cart.itemCount', { count: itemCount })}</span>
        </div>

        {storageError && (
          <p role="alert" className={`mb-6 rounded-lg border p-4 ${darkMode ? 'border-amber-400 text-amber-200' : 'border-amber-700 text-amber-900'}`}>
            {t('cart.storageError')}
          </p>
        )}

        {items.length === 0 ? (
          <div className={`rounded-lg p-8 text-center sm:p-14 ${surface}`}>
            <h2 className="text-xl font-semibold">{t('cart.empty')}</h2>
            <p className={`mt-2 ${muted}`}>{t('cart.emptyDescription')}</p>
            <Link to="/products" className="mt-6 inline-block rounded bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700">
              {t('cart.continueShopping')}
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <ul className={`divide-y overflow-hidden rounded-lg ${surface} ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {items.map(item => (
                <li key={item.productId} className="flex flex-wrap gap-4 p-4 sm:flex-nowrap sm:gap-6 sm:p-6">
                  <img src={`/${item.imgName}`} alt="" className={`h-24 w-24 shrink-0 rounded object-contain p-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className={`mt-1 text-sm ${muted}`}>{t('cart.unitPrice', { price: formatPrice(unitPriceCents(item)) })}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className={`inline-flex items-center rounded border ${border}`}>
                        <button type="button" aria-label={t('cart.decrease', { name: item.name })} disabled={item.quantity <= 1} onClick={() => changeQuantity(item.productId, -1)} className="h-10 w-10 font-bold disabled:opacity-40">−</button>
                        <span aria-label={t('cart.quantity', { name: item.name })} className="min-w-8 text-center tabular-nums">{item.quantity}</span>
                        <button type="button" aria-label={t('cart.increase', { name: item.name })} onClick={() => changeQuantity(item.productId, 1)} className="h-10 w-10 font-bold">+</button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.productId)} aria-label={t('cart.remove', { name: item.name })} className={`text-sm underline underline-offset-2 ${muted}`}>
                        {t('cart.remove', { name: item.name })}
                      </button>
                    </div>
                  </div>
                  <p className="ml-auto font-semibold tabular-nums">{formatPrice(unitPriceCents(item) * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <section aria-labelledby="cart-summary" className={`rounded-lg p-6 ${surface}`}>
              <h2 id="cart-summary" className="text-xl font-semibold">{t('cart.summary')}</h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4"><dt className={muted}>{t('cart.subtotal')}</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
                <div className="flex justify-between gap-4"><dt className={muted}>{t('cart.shipping')}</dt><dd className="tabular-nums">{shipping === 0 ? t('cart.free') : formatPrice(shipping)}</dd></div>
                <div className={`flex justify-between gap-4 border-t pt-4 text-base font-bold ${border}`}><dt>{t('cart.total')}</dt><dd className="tabular-nums">{formatPrice(total)}</dd></div>
              </dl>
              <p className={`mt-5 text-sm ${muted}`}>{t('cart.shippingNote')}</p>
              <p className={`mt-4 text-sm ${muted}`}>{t('cart.checkoutNote')}</p>
              <Link to="/products" className="mt-6 inline-block font-semibold underline underline-offset-4">{t('cart.continueShopping')}</Link>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
