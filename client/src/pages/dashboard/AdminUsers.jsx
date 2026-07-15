import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineTrash,
  HiOutlineBan,
  HiOutlineCheckCircle,
  HiOutlineEye,
} from 'react-icons/hi';
import api from '../../services/api';
import Loader from '../../components/Loader';

const AdminUsers = () => {
  const [users, setUsers] = useState(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
const [showModal, setShowModal] = useState(false);
const [loadingUser, setLoadingUser] = useState(false);

  const load = async () => {
    const { data } = await api.get('/users', { params: { role: roleFilter, search } });
    setUsers(data.data);
  };

  useEffect(() => { 
    load();
  }, [roleFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      load();
    } catch (err) {
      toast.error('Could not delete user');
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.put(`/users/${id}/status`);
      load();
    } catch (err) {
      toast.error('Could not update user status');
    }
  };

const handleView = async (id) => {
  try {
    setLoadingUser(true);

    const { data } = await api.get(`/users/${id}`);

    setSelectedUser(data.data);
    setShowModal(true);
  } catch (err) {
    toast.error("Could not load user details");
  } finally {
    setLoadingUser(false);
  }
};

  if (!users) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Manage users</h1>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          className="input"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
        />
        <select className="input sm:w-48" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All roles</option>
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={load} className="btn-secondary shrink-0">Search</button>
      </div>

      <div className="card mt-6 divide-y divide-black/5 dark:divide-white/10">
        {users.map((u) => (
          <div key={u._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold">{u.name} <span className="badge ml-2 capitalize">{u.role}</span></p>
              <p className="text-xs text-ink/50 dark:text-paper/50">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
  onClick={() => handleView(u._id)}
  className="btn-secondary px-2.5 py-1.5 text-blue-500"
>
  <HiOutlineEye />
</button>
              <span className={`text-xs font-medium ${u.isActive ? 'text-primary-600' : 'text-red-500'}`}>
                {u.isActive ? 'Active' : 'Deactivated'}
              </span>
              <button onClick={() => handleToggle(u._id)} className="btn-secondary px-2.5 py-1.5 text-xs">
                {u.isActive ? <HiOutlineBan /> : <HiOutlineCheckCircle />}
              </button>
              <button onClick={() => handleDelete(u._id)} className="btn-secondary px-2.5 py-1.5 text-xs text-red-500">
                <HiOutlineTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 dark:bg-slate-900">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          User Details
        </h2>

        <button
          onClick={() => setShowModal(false)}
          className="btn-secondary"
        >
          Close
        </button>
      </div>

      {loadingUser ? (
        <Loader />
      ) : (
        selectedUser && (
          <div className="space-y-6">

            {selectedUser.avatar && (
              <div className="flex justify-center">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="h-28 w-28 rounded-full object-cover"
                />
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <p className="font-semibold">Name</p>
                <p>{selectedUser.name}</p>
              </div>

              <div>
                <p className="font-semibold">Email</p>
                <p>{selectedUser.email}</p>
              </div>

              <div>
                <p className="font-semibold">Role</p>
                <p className="capitalize">{selectedUser.role}</p>
              </div>

              <div>
                <p className="font-semibold">Phone</p>
                <p>{selectedUser.phone || "-"}</p>
              </div>

              <div>
                <p className="font-semibold">Experience</p>
                <p>{selectedUser.experience || "-"}</p>
              </div>

              <div>
                <p className="font-semibold">Status</p>
                <p>{selectedUser.isActive ? "Active" : "Inactive"}</p>
              </div>

              {selectedUser.company && (
                <div>
                  <p className="font-semibold">Company</p>
                  <p>{selectedUser.company.name}</p>
                </div>
              )}

            </div>

            <div>
              <p className="font-semibold mb-2">Skills</p>

              <div className="flex flex-wrap gap-2">
                {selectedUser.skills?.length ? (
                  selectedUser.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p>No skills</p>
                )}
              </div>
            </div>

            <div>
              <p className="font-semibold mb-2">Bio</p>

              <div className="rounded bg-gray-100 p-3 dark:bg-slate-800">
                {selectedUser.bio || "No bio"}
              </div>
            </div>

            {selectedUser.resumeUrl && (
              <div>
                <p className="font-semibold">Resume</p>

                <a
                  href={selectedUser.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  View Resume
                </a>
              </div>
            )}

          </div>
        )
      )}

    </div>
  </div>
)}
    </div>
  );
};

export default AdminUsers;
