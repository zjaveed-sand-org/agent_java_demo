import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';
import { formatCurrency } from '../../../utils/formatCurrency';

export default function Cart() {
  const { cartItems, subtotal, discountTotal, total, isSyncing, syncError, updateQuantity, removeFromCart, clearCart } = useCart();
  const { darkMode } = useTheme();
  const { t, i18n } = useTranslation(['cart', 'common']);
  const [statusMessage, setStatusMessage] = useState('');
  const [draftQuantities, setDraftQuantities] = useState<Record<number, string>>({});
  const localizedSyncError = syncError?.startsWith('cart:')
    ? t(syncError)
    : syncError;

  useEffect(() => {
    setDraftQuantities(
      Object.fromEntries(cartItems.map((item) => [item.cartItemId, item.quantity.toString()])),
    );
  }, [cartItems]);

  const commitQuantityInput = async (productId: number, cartItemId: number, currentQuantity: number) => {
    const nextQuantity = Number.parseInt(draftQuantities[cartItemId] ?? currentQuantity.toString(), 10);
    if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
      setDraftQuantities((currentDrafts) => ({
        ...currentDrafts,
        [cartItemId]: currentQuantity.toString(),
      }));
      return;
    }

    if (nextQuantity === currentQuantity) {
      return;
    }

    try {
      await updateQuantity(productId, nextQuantity);
    } catch {
      // Context syncError surfaces the failure.
      setDraftQuantities((currentDrafts) => ({
        ...currentDrafts,
        [cartItemId]: currentQuantity.toString(),
      }));
    }
  };

  const handleQuantityInput = (cartItemId: number, event: ChangeEvent<HTMLInputElement>) => {
    setDraftQuantities((currentDrafts) => ({
      ...currentDrafts,
      [cartItemId]: event.target.value,
    }));
  };

  const handleQuantityKeyDown = async (
    productId: number,
    cartItemId: number,
    currentQuantity: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      await commitQuantityInput(productId, cartItemId, currentQuantity);
      return;
    }

    if (event.key === 'Escape') {
      setDraftQuantities((currentDrafts) => ({
        ...currentDrafts,
        [cartItemId]: currentQuantity.toString(),
      }));
    }
  };

  const handleRemove = async (productId: number, name: string) => {
    if (!window.confirm(t('cart:confirmations.removeItem', { name }))) {
      return;
    }

    try {
      await removeFromCart(productId);
      setStatusMessage(t('cart:messages.itemRemoved', { name }));
    } catch {
      // Context syncError surfaces the failure.
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setStatusMessage(t('cart:messages.cartCleared'));
    } catch {
      // Context syncError surfaces the failure.
    }
  };

  const handleCheckout = () => {
    setStatusMessage(t('cart:messages.checkoutPlaceholder'));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark text-light' : 'bg-gray-100 text-gray-800'} px-4 pb-16 pt-24 transition-colors duration-300`}>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('cart:pageTitle')}</h1>
            {isSyncing && <p className="mt-2 text-sm text-primary">{t('cart:status.syncing')}</p>}
          </div>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={() => void handleClearCart()}
              className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            >
              {t('cart:buttons.clearCart')}
            </button>
          )}
        </div>

        {statusMessage && (
          <div className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary" role="status" aria-live="polite">
            {statusMessage}
          </div>
        )}

        {syncError && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500" role="alert">
            {t('cart:messages.syncError', { message: localizedSyncError })}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-10 text-center shadow-md transition-colors duration-300`}>
            <h2 className="text-2xl font-semibold text-primary">{t('cart:empty.title')}</h2>
            <p className={`mx-auto mt-3 max-w-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('cart:empty.description')}</p>
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 font-medium text-white transition-colors hover:bg-accent"
            >
              {t('common:actions.continueShopping')}
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-x-auto rounded-2xl shadow-md transition-colors duration-300`}>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className={`${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-600'} text-left text-sm uppercase tracking-wide`}>
                    <th className="px-6 py-4">{t('cart:table.item')}</th>
                    <th className="px-6 py-4">{t('cart:table.unitPrice')}</th>
                    <th className="px-6 py-4">{t('cart:table.quantity')}</th>
                    <th className="px-6 py-4">{t('cart:table.lineTotal')}</th>
                    <th className="px-6 py-4">{t('cart:table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cartItems.map((item) => (
                    <tr key={item.cartItemId}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={`/${item.imgName}`}
                            alt={t('cart:labels.productImage', { name: item.name })}
                            className={`h-20 w-20 rounded-lg object-contain ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-2`}
                          />
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            {item.discount && (
                              <p className="text-sm text-primary">
                                {formatCurrency(item.price, i18n.language)} - {Math.round(item.discount * 100)}%
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatCurrency(item.discount ? item.price * (1 - item.discount) : item.price, i18n.language)}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-1`}>
                          <button
                            type="button"
                            onClick={() => {
                              void updateQuantity(item.productId, item.quantity - 1).catch(() => {
                                // Context syncError surfaces the failure.
                              });
                            }}
                            disabled={item.quantity <= 1}
                            className={`h-9 w-9 rounded-md text-lg transition-colors ${item.quantity <= 1 ? 'cursor-not-allowed opacity-40' : 'hover:text-primary'}`}
                            aria-label={t('cart:buttons.decreaseQuantity', { name: item.name })}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={draftQuantities[item.cartItemId] ?? item.quantity.toString()}
                            onChange={(event) => handleQuantityInput(item.cartItemId, event)}
                            onBlur={() => {
                              void commitQuantityInput(item.productId, item.cartItemId, item.quantity);
                            }}
                            onKeyDown={(event) => {
                              void handleQuantityKeyDown(item.productId, item.cartItemId, item.quantity, event);
                            }}
                            className={`${darkMode ? 'bg-gray-800 text-light border-gray-600' : 'bg-white text-gray-800 border-gray-300'} w-16 rounded-md border px-2 py-1 text-center`}
                            aria-label={t('cart:labels.quantityInput', { name: item.name })}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              void updateQuantity(item.productId, item.quantity + 1).catch(() => {
                                // Context syncError surfaces the failure.
                              });
                            }}
                            className="h-9 w-9 rounded-md text-lg transition-colors hover:text-primary"
                            aria-label={t('cart:buttons.increaseQuantity', { name: item.name })}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        {formatCurrency(item.lineTotal, i18n.language)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => void handleRemove(item.productId, item.name)}
                          className="rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                        >
                          {t('cart:buttons.removeItem', { name: item.name })}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className={`${darkMode ? 'bg-gray-800' : 'bg-white'} h-fit rounded-2xl p-6 shadow-md transition-colors duration-300`}>
              <h2 className="text-xl font-semibold">{t('cart:summary.title')}</h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt>{t('cart:summary.subtotal')}</dt>
                  <dd>{formatCurrency(subtotal, i18n.language)}</dd>
                </div>
                <div className="flex items-center justify-between text-primary">
                  <dt>{t('cart:summary.discounts')}</dt>
                  <dd>-{formatCurrency(discountTotal, i18n.language)}</dd>
                </div>
                <div className={`flex items-center justify-between border-t pt-4 text-lg font-semibold ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <dt>{t('cart:summary.total')}</dt>
                  <dd>{formatCurrency(total, i18n.language)}</dd>
                </div>
              </dl>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-accent"
                >
                  {t('cart:buttons.checkout')}
                </button>
                <Link
                  to="/products"
                  className={`block rounded-lg border px-4 py-3 text-center font-medium transition-colors ${darkMode ? 'border-gray-600 text-light hover:border-primary hover:text-primary' : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'}`}
                >
                  {t('common:actions.continueShopping')}
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
