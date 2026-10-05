import { useState } from 'react';
import Icon from '../Icons.jsx';
import { useStore } from '../store.jsx';
import { Page, Panel, Tabs, Toggle, Field } from '../components/ui.jsx';
import { initials } from '../utils.js';

const timezones = [
  '(GMT-12:00) International Date Line West',
  '(GMT-08:00) Pacific Time (US & Canada)',
  '(GMT-05:00) Eastern Time (US & Canada)',
  '(GMT+00:00) London',
  '(GMT+01:00) Paris',
  '(GMT+05:30) India Standard Time',
  '(GMT+09:00) Tokyo',
];

function EditProfile() {
  const { state, dispatch, showToast } = useStore();
  const [form, setForm] = useState(state.profile);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      showToast('Image size should be under 3MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setForm((prev) => ({ ...prev, avatar: event.target.result }));
      showToast('Profile photo updated! Click Save to apply.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = (e) => {
    e.preventDefault();
    setForm((prev) => ({ ...prev, avatar: '' }));
    showToast('Photo removed. Click Save to apply.');
  };

  const save = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = 'Enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email address';
    if (form.postalCode && !/^[\w -]{3,10}$/.test(form.postalCode)) err.postalCode = 'Enter a valid postal code';
    setErrors(err);
    if (Object.keys(err).length) return;
    dispatch({ type: 'updateProfile', profile: form });
    showToast('Profile saved');
  };

  const fields = [
    ['name', 'Your Name'], ['username', 'User Name'], ['email', 'Email', 'email'], ['password', 'Password', 'password'],
    ['dob', 'Date of Birth', 'date'], ['presentAddress', 'Present Address'], ['permanentAddress', 'Permanent Address'],
    ['city', 'City'], ['postalCode', 'Postal Code'], ['country', 'Country'],
  ];

  return (
    <form className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start" onSubmit={save} noValidate>
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <label htmlFor="avatar-file-input" className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-line bg-surface-2 grid place-items-center group cursor-pointer shadow-md select-none" title="Click to change photo">
        {form.avatar ? (
  <img
    src={form.avatar}
    alt={form.name}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.currentTarget.src = "/profile.png";
    }}
  />
) : (
  <img
    src="/profile.png"
    alt="Profile"
    className="w-full h-full object-cover"
  />
)}
            <span className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              <Icon name="camera" size={22} />
              <span>Change</span>
            </span>
          </label>
          <label htmlFor="avatar-file-input" className="absolute right-0 bottom-0 w-8 h-8 rounded-full bg-primary text-white grid place-items-center shadow-md cursor-pointer hover:scale-110 transition-transform" title="Change photo" tabIndex={0}>
            <Icon name="pencil" size={14} />
            <input
              id="avatar-file-input"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        {form.avatar && (
          <button
            type="button"
            className="text-xs font-medium text-neg hover:underline pt-1"
            onClick={handleRemoveAvatar}
          >
            Remove Photo
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map(([k, label, type]) => (
            <Field key={k} id={`p-${k}`} label={label} type={type || 'text'} value={form[k]} onChange={set(k)} error={errors[k]} />
          ))}
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" className="inline-flex justify-center px-10 py-3 rounded-xl bg-primary text-white font-semibold text-sm md:text-base hover:bg-primary-dark shadow-md transition-all active:scale-95">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

function Preferences() {
  const { state, dispatch, showToast, theme, setTheme } = useStore();
  const [form, setForm] = useState({ ...state.prefs, theme });

  const save = (e) => {
    e.preventDefault();
    dispatch({ type: 'updatePrefs', prefs: form });
    if (form.theme) setTheme(form.theme);
    showToast('Preferences saved');
  };

  return (
    <form onSubmit={save} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id="pref-theme" label="Theme Appearance">
          <select
            id="pref-theme"
            value={form.theme || theme || 'light'}
            onChange={(e) => setForm({ ...form, theme: e.target.value })}
            className="h-11 md:h-12 px-4 rounded-xl border border-field bg-surface text-text text-sm md:text-base outline-none focus:border-primary"
          >
            <option value="light">☀️ Light Theme</option>
            <option value="dark">🌙 Dark Theme</option>
          </select>
        </Field>
        <Field id="pref-currency" label="Currency">
          <select
            id="pref-currency"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="h-11 md:h-12 px-4 rounded-xl border border-field bg-surface text-text text-sm md:text-base outline-none focus:border-primary"
          >
            <option value="USD">USD ($)</option><option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option><option value="INR">INR (₹)</option>
          </select>
        </Field>
        <Field id="pref-tz" label="Time Zone">
          <select
            id="pref-tz"
            value={form.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            className="h-11 md:h-12 px-4 rounded-xl border border-field bg-surface text-text text-sm md:text-base outline-none focus:border-primary"
          >
            {timezones.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <div className="pt-2">
        <h4 className="text-base font-semibold text-ink mb-4">Notification</h4>
        <div className="flex flex-col gap-4">
          <Toggle id="n-digital" checked={form.notifyDigital} onChange={(v) => setForm({ ...form, notifyDigital: v })} label="I send or receive digital currency" />
          <Toggle id="n-merchant" checked={form.notifyMerchant} onChange={(v) => setForm({ ...form, notifyMerchant: v })} label="I receive merchant order" />
          <Toggle id="n-reco" checked={form.notifyRecommendations} onChange={(v) => setForm({ ...form, notifyRecommendations: v })} label="There are recommendation for my account" />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" className="inline-flex justify-center px-10 py-3 rounded-xl bg-primary text-white font-semibold text-sm md:text-base hover:bg-primary-dark shadow-md transition-all active:scale-95">
          Save
        </button>
      </div>
    </form>
  );
}

function Security() {
  const { state, dispatch, showToast } = useStore();
  const [pw, setPw] = useState({ current: '', next: '' });
  const [errors, setErrors] = useState({});

  const save = (e) => {
    e.preventDefault();
    const err = {};
    if (!pw.current) err.current = 'Enter your current password';
    if (pw.next.length < 8) err.next = 'Use at least 8 characters';
    setErrors(err);
    if (Object.keys(err).length) return;
    setPw({ current: '', next: '' });
    showToast('Password changed');
  };

  return (
    <form onSubmit={save} noValidate className="flex flex-col gap-6">
      <div>
        <h4 className="text-base font-semibold text-ink mb-4">Two-factor Authentication</h4>
        <Toggle id="s-2fa" checked={state.prefs.twoFactor} label="Enable or disable two factor authentication"
          onChange={(v) => { dispatch({ type: 'updatePrefs', prefs: { twoFactor: v } }); showToast(v ? 'Two-factor enabled' : 'Two-factor disabled'); }} />
      </div>

      <div className="pt-2">
        <h4 className="text-base font-semibold text-ink mb-4">Change Password</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
          <Field id="s-current" label="Current Password" type="password" value={pw.current} error={errors.current}
            onChange={(e) => setPw({ ...pw, current: e.target.value })} />
          <Field id="s-new" label="New Password" type="password" value={pw.next} error={errors.next}
            onChange={(e) => setPw({ ...pw, next: e.target.value })} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" className="inline-flex justify-center px-10 py-3 rounded-xl bg-primary text-white font-semibold text-sm md:text-base hover:bg-primary-dark shadow-md transition-all active:scale-95">
          Save
        </button>
      </div>
    </form>
  );
}

export default function Settings() {
  const { dispatch, showToast } = useStore();
  const [tab, setTab] = useState('profile');

  return (
    <Page>
      <Panel className="p-6 md:p-8">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[{ key: 'profile', label: 'Edit Profile' }, { key: 'prefs', label: 'Preferences' }, { key: 'security', label: 'Security' }]}
        />
        <div className="pt-8">
          {tab === 'profile' && <EditProfile />}
          {tab === 'prefs' && <Preferences />}
          {tab === 'security' && <Security />}
        </div>
        <div className="flex justify-end pt-6 mt-6 border-t border-line">
          <button
            className="text-xs text-muted hover:text-primary transition-colors hover:underline"
            onClick={() => { dispatch({ type: 'reset' }); showToast('Demo data reset'); setTab('profile'); }}
          >
            Reset demo data
          </button>
        </div>
      </Panel>
    </Page>
  );
}
