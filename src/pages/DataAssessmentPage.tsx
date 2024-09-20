import { useState } from 'react';
import ErrorNotification from '../components/ErrorNotification';
import Modal from '../components/EditModal';
import AssessmentList from '../components/assessment/AssessmentListComponent';
import AssessmentEditForm from '../components/assessment/AssessmentEditFormComponent';
import AssessmentAddForm from '../components/assessment/AssessmentAddFormComponent';

const DataAssessmentPage: React.FC = () => {
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(
    null,
  );
  const [addingAssessment, setAddingAssessment] = useState<boolean>(false);
  const [selectedAssessment, setSelectedAssessment] = useState<{
    id: string | null;
    title: string;
    url: string;
  }>({ id: null, title: '', url: '' });
  const [refresh, setRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRefresh = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const handleError = (message: string | string[]) => {
    const errorMessage = Array.isArray(message) ? message.join(', ') : message;
    setErrorMessage(errorMessage);
  };

  const handleEditAssessment = (id: string, title: string, url: string) => {
    setSelectedAssessment({ id, title, url });
    setEditingAssessmentId(id);
  };

  const handleAddAssessment = () => {
    setAddingAssessment(true);
  };

  return (
    <div className='bg-gray-100 min-h-screen p-6 dark:bg-gray-900 dark:text-gray-200'>
      {errorMessage && (
        <ErrorNotification
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      <div className='bg-white p-8 rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-200'>
        <h1 className='text-2xl font-bold text-center mb-4 pt-8 dark:text-white'>
          Data Assessment
        </h1>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-full max-w-3xl'>
            <button
              onClick={handleAddAssessment}
              className='flex items-center text-black mb-4 bg-slate-300 hover:bg-slate-400 ease-in-out duration-300 p-2 rounded-md dark:text-gray-200 dark:bg-slate-600 dark:hover:bg-slate-700'
            >
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 4v16m8-8H4'
                ></path>
              </svg>
              Data Assessment
            </button>
            <AssessmentList
              onEdit={handleEditAssessment}
              refresh={refresh}
              editingId={editingAssessmentId}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!editingAssessmentId}
        onClose={() => setEditingAssessmentId(null)}
      >
        <AssessmentEditForm
          id={selectedAssessment.id || ''}
          initialTitle={selectedAssessment.title}
          initialUrl={selectedAssessment.url}
          onSuccess={() => {
            setEditingAssessmentId(null);
            handleRefresh();
          }}
          onError={handleError}
        />
      </Modal>

      <Modal
        isOpen={addingAssessment}
        onClose={() => setAddingAssessment(false)}
      >
        <AssessmentAddForm
          onAddSuccess={() => {
            setAddingAssessment(false);
            handleRefresh();
          }}
        />
      </Modal>
    </div>
  );
};

export default DataAssessmentPage;
