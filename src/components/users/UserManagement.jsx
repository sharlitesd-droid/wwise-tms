import { motion } from 'framer-motion';
import { FiShield, FiMail, FiMapPin } from 'react-icons/fi';
import { useUsers, updateUserRole } from '../../hooks/useFirestore';
import { getBranchName, ROLE_LABELS, ROLES } from '../../constants';
import LoadingSpinner from '../common/LoadingSpinner';
import './UserManagement.css';

export default function UserManagement() {
  const { users, loading } = useUsers();

  async function handleRoleChange(userId, newRole) {
    await updateUserRole(userId, newRole);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="users-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>User Management</h1>
          <p>Manage user roles and branch assignments</p>
        </div>
      </motion.div>

      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Branch</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <motion.tr
                key={u.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-sm">
                      {u.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span>{u.displayName}</span>
                  </div>
                </td>
                <td><span className="table-cell-icon"><FiMail /> {u.email}</span></td>
                <td><span className="table-cell-icon"><FiMapPin /> {getBranchName(u.branchId)}</span></td>
                <td>
                  <select
                    className="role-select"
                    value={u.role || ROLES.EMPLOYEE}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  >
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="role-legend">
        <h3><FiShield /> Role Permissions</h3>
        <ul>
          <li><strong>System Administrator</strong> — Full access to all branches, users, and reports</li>
          <li><strong>Branch Administrator</strong> — Manage tasks and users within their branch</li>
          <li><strong>Employee</strong> — Create and update assigned tasks</li>
        </ul>
      </div>
    </div>
  );
}
