const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-5 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="mt-3">{children}</div>
          <button onClick={onClose} className="mt-4 bg-red-500 px-3 py-1 rounded">
            Close
          </button>
        </div>
      </div>
    );
  };
  
  export default Modal;
  