import { HiCheckCircle } from "react-icons/hi";

const ChangeEmailProgress = ({ step }) => {
  return (
    <div className="mb-8 flex items-center">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex flex-1 items-center">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              step >= item
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step > item ? <HiCheckCircle className="h-5 w-5" /> : item}
          </div>

          {item !== 4 && (
            <div
              className={`mx-2 h-1 flex-1 rounded ${
                step > item ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ChangeEmailProgress;
