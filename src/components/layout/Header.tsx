import { Button } from "@/components/ui/Button";

type HeaderProps = {
  title: string;
  roleLabel: string;
  userName: string;
  userEmail?: string;
  onSignOut: () => void;
};

export function Header({ title, roleLabel, userName, userEmail, onSignOut }: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">
          {userName} • {roleLabel}
        </p>
        {userEmail ? <p className="text-xs text-slate-400">{userEmail}</p> : null}
      </div>
      <Button variant="secondary" onClick={onSignOut}>
        Sign out
      </Button>
    </header>
  );
}
