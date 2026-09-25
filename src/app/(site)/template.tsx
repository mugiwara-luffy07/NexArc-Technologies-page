/** Re-mounts on every navigation, giving each page a soft CSS entrance (see .page-in). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
