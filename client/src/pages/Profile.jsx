import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/authService';
import Loader from '../components/Loader';

const Profile = () => {
  const { user, updateStoredUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfileChange = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  const handlePwChange = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const submitProfile = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!profileForm.name.trim()) errs.name = 'Name is required';
    setProfileErrors(errs);
    if (Object.keys(errs).length) return;

    setProfileLoading(true);
    try {
      const { data } = await updateProfile(profileForm);
      updateStoredUser(data.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwForm.currentPassword) errs.currentPassword = 'Current password is required';
    if (pwForm.newPassword.length < 6) errs.newPassword = 'New password must be at least 6 characters';
    if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setPwErrors(errs);
    if (Object.keys(errs).length) return;

    setPwLoading(true);
    try {
      await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Profile</h1>
      </div>

      <div className="dashboard-grid">
        <form className="panel form-panel" onSubmit={submitProfile} noValidate>
          <h2>Account Details</h2>

          <label className="form-field">
            <span>Email</span>
            <input value={user?.email || ''} disabled />
          </label>

          <label className="form-field">
            <span>Full Name</span>
            <input name="name" value={profileForm.name} onChange={handleProfileChange} />
            {profileErrors.name && <span className="field-error">{profileErrors.name}</span>}
          </label>

          <label className="form-field">
            <span>Bio</span>
            <textarea name="bio" value={profileForm.bio} onChange={handleProfileChange} rows={3} maxLength={200} />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={profileLoading}>
              {profileLoading ? <Loader size="sm" /> : 'Save Profile'}
            </button>
          </div>
        </form>

        <form className="panel form-panel" onSubmit={submitPassword} noValidate>
          <h2>Change Password</h2>

          <label className="form-field">
            <span>Current Password</span>
            <input
              type="password"
              name="currentPassword"
              value={pwForm.currentPassword}
              onChange={handlePwChange}
            />
            {pwErrors.currentPassword && <span className="field-error">{pwErrors.currentPassword}</span>}
          </label>

          <label className="form-field">
            <span>New Password</span>
            <input type="password" name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} />
            {pwErrors.newPassword && <span className="field-error">{pwErrors.newPassword}</span>}
          </label>

          <label className="form-field">
            <span>Confirm New Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={pwForm.confirmPassword}
              onChange={handlePwChange}
            />
            {pwErrors.confirmPassword && <span className="field-error">{pwErrors.confirmPassword}</span>}
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={pwLoading}>
              {pwLoading ? <Loader size="sm" /> : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
