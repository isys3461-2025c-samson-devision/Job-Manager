import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface Country {
  code: string;
  name: string;
}

interface Props {
  countries: Country[];
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export default function CountrySelect({
  countries,
  value,
  onChange,
  error,
}: Props) {
  const selected = countries.find((c) => c.code === value);

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative mt-2">
        {/* ================= BUTTON ================= */}
        <Listbox.Button
          className={`w-full px-3 py-2 border rounded flex items-center justify-between
            hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
        >
          <div className="flex items-center gap-2">
            {selected ? (
              <>
                <img
                  src={`https://flagsapi.com/${selected.code}/flat/24.png`}
                  alt={selected.name}
                  className="w-5 h-5"
                />
                <span className="text-gray-800">
                  {selected.name}
                </span>
              </>
            ) : (
              <span className="text-gray-400">
                Select a country
              </span>
            )}
          </div>

          {/* DROPDOWN ICON */}
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Listbox.Button>

        {/* ================= OPTIONS ================= */}
        <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none">
          {countries.map((c) => (
            <Listbox.Option
              key={c.code}
              value={c.code}
              className={({ active }) =>
                `cursor-pointer px-3 py-2 flex items-center gap-2 ${
                  active ? 'bg-blue-100' : ''
                }`
              }
            >
              <img
                src={`https://flagsapi.com/${c.code}/flat/24.png`}
                alt={c.name}
                className="w-5 h-5"
              />
              <span className="text-gray-700">
                {c.name}
              </span>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
