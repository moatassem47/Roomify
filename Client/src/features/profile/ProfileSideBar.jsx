import { Info, MapPin, ShieldCogCorner, User, UserRound} from "lucide-react";

const ProfileSideBar = ({firstName,lastName,email}) => {
  return (
    <aside className="w-full md:w-80 space-y-6">
      <div className="bg-white p-8 rounded-xl custom-shadow flex flex-col items-center text-center">
        <div className="relative group mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container shadow-inner flex items-center justify-center">
            <UserRound className="w-20 h-fit" />
          </div>
        </div>
        <h1 className="font-headline-sm text-headline-sm text-on-surface">
          {firstName} {lastName}
        </h1>
        <p className="text-on-surface-variant font-label-md mb-6">
          {email}
        </p>
      </div>
      <nav className="bg-white p-4 rounded-xl custom-shadow">
        <ul className="space-y-1">
          <li>
            <a
              className="flex items-center gap-3 text-stone-500 px-4 py-3 hover:bg-stone-50 rounded-xl transition-all font-label-md"
              href="#Personal"
            >
              <User /> Personal Info
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-3 text-stone-500 px-4 py-3 hover:bg-stone-50 rounded-xl transition-all font-label-md"
              href="#Address"
            >
              <MapPin /> Addresses
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-3 text-stone-500 px-4 py-3 hover:bg-stone-50 rounded-xl transition-all font-label-md"
              href="#Security"
            >
              <ShieldCogCorner />
              Security
            </a>
          </li>
          <li>
            <a
              className="flex items-center gap-3 text-stone-500 px-4 py-3 hover:bg-stone-50 rounded-xl transition-all font-label-md"
              href="#status"
            >
              <Info /> Account Status
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default ProfileSideBar;
