import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

      <p className="mb-2"><strong>Name:</strong> {user.name}</p>
      <p className="mb-2"><strong>Email:</strong> {user.email}</p>

      {user.resume ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Uploaded Resume</h3>
          <embed
            src={`http://localhost:5000/${user.resume}`}
            type="application/pdf"
            width="100%"
            height="500px"
            className="border rounded"
          />
        </div>
      ) : (
        <p className="text-red-500 mt-6">No resume uploaded yet.</p>
      )}
    </div>
  );
}
