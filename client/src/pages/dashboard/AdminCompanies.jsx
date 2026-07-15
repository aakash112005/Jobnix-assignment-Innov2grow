// import { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { HiOutlineTrash } from 'react-icons/hi';
// import { companyService } from '../../services/jobService';
// import api from '../../services/api';
// import Loader from '../../components/Loader';

// const AdminCompanies = () => {
//   const [companies, setCompanies] = useState(null);

//   const load = async () => {
//     const res = await companyService.getCompanies({ limit: 50 });
//     setCompanies(res.data);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this company?')) return;
//     try {
//       await api.delete(`/companies/${id}`);
//       toast.success('Company deleted');
//       load();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Could not delete company');
//     }
//   };

//   if (!companies) return <Loader />;

//   return (
//     <div>
//       <h1 className="font-display text-2xl font-bold">Manage companies</h1>

//       <div className="card mt-6 divide-y divide-black/5 dark:divide-white/10">
//         {companies.length === 0 && <p className="p-6 text-sm text-ink/60 dark:text-paper/60">No companies yet.</p>}
//         {companies.map((c) => (
//           <div key={c._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
//             <div>
//               <p className="font-semibold">{c.name}</p>
//               <p className="text-xs text-ink/50 dark:text-paper/50">{c.industry} · {c.location}</p>
//             </div>
//             <button onClick={() => handleDelete(c._id)} className="btn-secondary px-2.5 py-1.5 text-xs text-red-500">
//               <HiOutlineTrash />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminCompanies;


import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi';
import { companyService } from '../../services/jobService';
import api from '../../services/api';
import Loader from '../../components/Loader';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingCompany, setLoadingCompany] = useState(false);

  const load = async () => {
    const res = await companyService.getCompanies({ limit: 50 });
    setCompanies(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company?')) return;

    try {
      await api.delete(`/companies/${id}`);
      toast.success('Company deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete company');
    }
  };

  const handleView = async (id) => {
    try {
      setLoadingCompany(true);
      const company = await companyService.getCompanyById(id);
      setSelectedCompany(company);
      setShowModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load company details');
    } finally {
      setLoadingCompany(false);
    }
  };

  if (!companies) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">
        Manage Companies
      </h1>

      <div className="card mt-6 divide-y divide-black/5 dark:divide-white/10">
        {companies.length === 0 && (
          <p className="p-6 text-sm text-ink/60 dark:text-paper/60">
            No companies yet.
          </p>
        )}

        {companies.map((c) => (
          <div
            key={c._id}
            className="flex flex-wrap items-center justify-between gap-3 p-4"
          >
            <div>
              <p className="font-semibold">{c.name}</p>

              <p className="text-xs text-ink/50 dark:text-paper/50">
                {c.industry} • {c.location}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleView(c._id)}
                className="btn-secondary px-2.5 py-1.5 text-blue-500"
                title="View Details"
              >
                <HiOutlineEye size={18} />
              </button>

              <button
                onClick={() => handleDelete(c._id)}
                className="btn-secondary px-2.5 py-1.5 text-red-500"
                title="Delete Company"
              >
                <HiOutlineTrash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Company Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">

            {loadingCompany ? (
              <Loader />
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-3xl font-bold">
                    Company Details
                  </h2>

                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Close
                  </button>
                </div>

                {selectedCompany && (
                  <>
                    {selectedCompany.logo && (
                      <div className="mb-6 flex justify-center">
                        <img
                          src={selectedCompany.logo}
                          alt={selectedCompany.name}
                          className="h-28 w-28 rounded-xl border object-contain"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                      <div>
                        <p className="font-semibold text-gray-500">
                          Company Name
                        </p>
                        <p>{selectedCompany.name || '-'}</p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-500">
                          Industry
                        </p>
                        <p>{selectedCompany.industry || '-'}</p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-500">
                          Website
                        </p>

                        {selectedCompany.website ? (
                          <a
                            href={selectedCompany.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedCompany.website}
                          </a>
                        ) : (
                          <p>-</p>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-500">
                          Location
                        </p>
                        <p>{selectedCompany.location || '-'}</p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-500">
                          Company Size
                        </p>
                        <p>{selectedCompany.size || '-'}</p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-500">
                          Owner
                        </p>
                        <div>
  <p className="font-semibold text-gray-500">Owner</p>
  <p>{selectedCompany.owner?.name || '-'}</p>
  <p className="text-sm text-gray-500">
    {selectedCompany.owner?.email}
  </p>
</div>
                      </div>

                      <div className="md:col-span-2">
                        <p className="font-semibold text-gray-500">
                          Description
                        </p>

                        <p className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-100 p-4 dark:bg-slate-800">
                          {selectedCompany.description || 'No description available.'}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-500">
                          Created At
                        </p>

                        <p>
                          {selectedCompany.createdAt
                            ? new Date(selectedCompany.createdAt).toLocaleString()
                            : '-'}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-500">
                          Updated At
                        </p>

                        <p>
                          {selectedCompany.updatedAt
                            ? new Date(selectedCompany.updatedAt).toLocaleString()
                            : '-'}
                        </p>
                      </div>

                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;
