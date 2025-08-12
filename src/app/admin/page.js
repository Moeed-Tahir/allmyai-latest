import connectDB from '@/lib/mongodb';
import Email from '@/models/Email';

export default async function AdminPage() {
  let emails = [];
  let error = null;

  try {
    await connectDB();
    const emailDocs = await Email.find({}).sort({ createdAt: -1 }).lean();
    emails = emailDocs.map(doc => ({
      _id: doc._id.toString(),
      email: doc.email,
      createdAt: doc.createdAt.toISOString()
    }));
  } catch (err) {
    error = 'Failed to fetch emails';
    console.error('Error fetching emails:', err);
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Email Subscribers</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="mb-4">
            <p className="text-gray-600">
              Total subscribers: <span className="font-semibold">{emails.length}</span>
            </p>
          </div>

          {emails.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Subscribed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emails.map((email) => (
                    <tr key={email._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {email.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(email.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No email subscribers yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
