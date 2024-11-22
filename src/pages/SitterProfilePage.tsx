import EditSitterProfileForm from "../components/profile/EditSitterProfileForm";
import EnquiryForm from "../components/enquiry/EnquiryForm";
import { useState } from "react";

const SitterProfilePage: React.FC = () => {
  const [showEditProfileForm, setShowEditProfileForm] =
    useState<boolean>(false);

  const [showEnquiryForm, setShowEnquiryForm] = useState<boolean>(false);

  return (
    <div>
      <h1>Sitter Profile Page</h1>
      <p>Here is a trusted pet sitter!</p>
      <button
        onClick={() => setShowEnquiryForm((prev: boolean) => !prev)}
        className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
      >
        {showEnquiryForm ? "Close" : "Make An Enquiry"}
      </button>
      {showEnquiryForm && (
        <div className="mt-6">
          <EnquiryForm />
        </div>
      )}
      <button
        onClick={() => setShowEditProfileForm((prev: boolean) => !prev)}
        className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
      >
        {showEditProfileForm ? "Close" : "Edit Sitter Details"}
      </button>

      {showEditProfileForm && (
        <div className="mt-6">
          <EditSitterProfileForm />
        </div>
      )}
    </div>
  );
};

export default SitterProfilePage;
