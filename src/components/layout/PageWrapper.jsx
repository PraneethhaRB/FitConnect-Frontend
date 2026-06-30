export default function PageWrapper({ children }) {
    return (
      <div className="animate-fadeIn">
        {children}
      </div>
    );
  }