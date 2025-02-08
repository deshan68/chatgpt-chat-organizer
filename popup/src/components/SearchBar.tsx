import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";

const SearchBar = () => {
  return (
    <TextField.Root placeholder="Search" size="1" radius="large" my="2" mx="4">
      <TextField.Slot>
        <MagnifyingGlassIcon height="14" width="14" />
      </TextField.Slot>
    </TextField.Root>
  );
};

export default SearchBar;
