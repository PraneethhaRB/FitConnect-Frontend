export default function ErrorMessage({ message }) {
    if (!message) return null;
    return (
      <div className="bg-error/10 border border-error text-error text-sm rounded-lg px-4 py-3">
        {message}
      </div>
    );
  }