import { ProfileEditor } from '../components/ProfileEditor';
import { Preview } from '../components/Preview';

export function ProfilePage() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8">
      <div className="w-full lg:w-1/3 bg-gray-800/30 rounded-xl h-[calc(100vh-10rem)]">
        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="p-4">
            <ProfileEditor />
          </div>
        </div>
      </div>
      <div className="w-full lg:w-2/3">
        <Preview />
      </div>
    </div>
  );
}