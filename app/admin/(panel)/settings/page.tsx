import { getSettings } from "@/lib/data";
import { changePassword, updateSettings } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    error?: string;
    passwordChanged?: string;
  }>;
}) {
  const params = await searchParams;
  const settings = await getSettings();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          These details appear across the website — header, footer, contact
          page and quotes.
        </p>
      </div>

      {params.saved && (
        <p className="rounded-lg border border-mint-dark bg-mint-soft px-4 py-3 text-sm font-semibold text-navy">
          ✓ Settings saved.
        </p>
      )}
      {params.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {params.error}
        </p>
      )}
      {params.passwordChanged && (
        <p className="rounded-lg border border-mint-dark bg-mint-soft px-4 py-3 text-sm font-semibold text-navy">
          ✓ Password changed.
        </p>
      )}

      <form action={updateSettings} className="card space-y-6 p-6">
        <h2 className="text-lg font-bold text-navy">Contact details</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="phone">Phone number</label>
            <input id="phone" name="phone" defaultValue={settings.phone} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="phoneDial">Phone for dialling</label>
            <input id="phoneDial" name="phoneDial" defaultValue={settings.phoneDial} className="input" />
            <p className="mt-1 text-xs text-slate-500">
              International format, e.g. +447377372889
            </p>
          </div>
          <div>
            <label className="label" htmlFor="whatsapp">WhatsApp number</label>
            <input id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp} className="input" />
            <p className="mt-1 text-xs text-slate-500">
              Digits only with country code, e.g. 447377372889
            </p>
          </div>
          <div>
            <label className="label" htmlFor="email">Business email</label>
            <input id="email" name="email" type="email" defaultValue={settings.email} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="instagram">Instagram username</label>
            <input id="instagram" name="instagram" defaultValue={settings.instagram} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="serviceArea">Service area</label>
            <input id="serviceArea" name="serviceArea" defaultValue={settings.serviceArea} className="input" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="responseTime">Response promise</label>
          <input id="responseTime" name="responseTime" defaultValue={settings.responseTime} className="input" />
        </div>

        <h2 className="pt-2 text-lg font-bold text-navy">Company details (footer)</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="companyName">Company name</label>
            <input id="companyName" name="companyName" defaultValue={settings.companyName} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="companyNumber">Company number</label>
            <input id="companyNumber" name="companyNumber" defaultValue={settings.companyNumber} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="registrationPlace">Place of registration</label>
            <input id="registrationPlace" name="registrationPlace" defaultValue={settings.registrationPlace} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="registeredOffice">Registered office</label>
            <input id="registeredOffice" name="registeredOffice" defaultValue={settings.registeredOffice} className="input" />
          </div>
        </div>

        <h2 className="pt-2 text-lg font-bold text-navy">Payment details</h2>
        <p className="-mt-3 text-xs text-slate-500">
          Shown to customers when they ask how to pay. Bank details are only
          shared after you send a quote — leave blank if you prefer.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="bankName">Bank name</label>
            <input id="bankName" name="bankName" defaultValue={settings.bankName} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="accountName">Account name</label>
            <input id="accountName" name="accountName" defaultValue={settings.accountName} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="sortCode">Sort code</label>
            <input id="sortCode" name="sortCode" defaultValue={settings.sortCode} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="accountNumber">Account number</label>
            <input id="accountNumber" name="accountNumber" defaultValue={settings.accountNumber} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="stripeLink">Stripe payment link</label>
            <input id="stripeLink" name="stripeLink" defaultValue={settings.stripeLink} className="input" placeholder="https://buy.stripe.com/…" />
            <p className="mt-1 text-xs text-slate-500">
              Optional — leave blank for now. Card payments stay switched off
              until you add your Stripe payment link here (or a Stripe API key
              in .env); quotes go out with bank transfer details only.
            </p>
          </div>
        </div>

        <button type="submit" className="btn-navy">
          Save settings
        </button>
      </form>

      <form action={changePassword} className="card space-y-5 p-6">
        <h2 className="text-lg font-bold text-navy">Change your password</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="current">Current password</label>
            <input id="current" name="current" type="password" required autoComplete="current-password" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="next">New password</label>
            <input id="next" name="next" type="password" required minLength={8} autoComplete="new-password" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="confirm">Repeat new password</label>
            <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" className="input" />
          </div>
        </div>
        <button type="submit" className="btn-navy">
          Change password
        </button>
      </form>
    </div>
  );
}
