import AuthGate from "./auth-gate";

export default function SwitchStepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGate>{children}</AuthGate>;
}
