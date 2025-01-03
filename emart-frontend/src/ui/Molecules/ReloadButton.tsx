import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

export default function ReloadButton({ fetchData }: { fetchData: () => void }) {
  return (
    <button
      type="button"
      aria-label="Reload"
      className="reload-button shadow-sm h-11 rounded-[0.8rem] border-[1px] border-[#d9d9d9] px-5 py-2 duration-200 hover:border-blue-500 hover:text-blue-500"
      onClick={fetchData}
    >
      <FontAwesomeIcon
        icon={faRotateRight}
        size="xl"
        className="reload-icon transition-transform duration-100 ease-in-out"
      />
    </button>
  );
}
