export function SidebarLayout({ children }) {
  return (
    <div className="hidden sm:block bg-orange-500">
      { children }
    </div>
  );
}
