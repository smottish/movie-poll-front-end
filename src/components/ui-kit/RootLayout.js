export function RootLayout({ children, ...props }) {
  return (
    <div className="grid grid-cols-layout grid-rows-layout h-screen" {...props}>
      {children}
    </div>
  );
}
