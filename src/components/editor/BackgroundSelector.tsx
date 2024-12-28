import { UploadIcon } from 'lucide-react';
import { useProfileStore } from '../../store/profileStore';

import Background1 from '../../assets/media/dftvvfnv.bmp';
import Background2 from '../../assets/media/r8wm0kbl.bmp';
import Background3 from '../../assets/media/tbsj844z.bmp';

const BACKGROUND_OPTIONS = [Background1, Background2, Background3];

export function BackgroundSelector() {
  const { background, setBackground } = useProfileStore();

  const handleFileUpload = (file: File) => {
    const validExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validExtensions.includes(file.type)) {
      console.error('Invalid file format. Please select a PNG, JPG or JPEG file.');
      alert('Invalid file format. Please select a PNG, JPG or JPEG file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setBackground(result); // Type string confirmed
      } else {
        console.error('The file could not be read correctly.');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-200">
        Background Image
      </label>
      <div className="grid grid-cols-3 gap-4">
        {BACKGROUND_OPTIONS.map((url, index) => (
          <button
            key={index}
            onClick={() => setBackground(url)}
            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
              background === url ? 'border-green-500 scale-95' : 'border-transparent hover:border-green-500/50'
            }`}
          >
            <img
              src={url}
              alt={`Background option ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      <div className="relative mt-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Or Upload Your Own Image
        </label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file);
              } else {
                console.error('No files selected');
              }
            }}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg text-sm text-gray-200 cursor-pointer hover:bg-gray-600 transition-colors"
          >
            <UploadIcon size={16} />
            Upload Image
          </label>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          We only accept images in PNG, JPG, or JPEG format.
        </p>
      </div>
    </div>
  );
}