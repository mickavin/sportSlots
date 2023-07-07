import React from 'react';
import {AutoComplete} from "./index";
import {useSelector} from "react-redux";

const UserSearch = ({onSelect, value, onChange, task, projectMembers, addedItems=[]}) => {
  const [searchTxt, setSearchText] = React.useState('');
  const [users, setUsers] = React.useState([]);
  const contacts = useSelector(s => s.company?.companyDetail?.data?.employees);

  const memberIds = React.useMemo(() => (addedItems).map(m => m._id), [addedItems]);

  const search = React.useCallback(text => {
    setSearchText(text);
    if (!text) setUsers([]);
    else {
      setUsers(
        (contacts)
          .filter(u => {
            return u.firstName.toLowerCase().concat(u.lastName.toLowerCase()).includes(text.toLowerCase())
              && !memberIds.includes(u._id)
          })
      );
    }
  }, [memberIds, projectMembers]);

  return (
    <AutoComplete
      placeholder="Rechercher un membre"
      options={(searchTxt ? users : (contacts).filter(c => !memberIds.includes(c._id))).map(m => ({value: m._id, label: m.firstName + ' ' + m.lastName}))}
      onSearch={search}
      onSelect={val => !memberIds.includes(val.value) && onSelect(val)}
      value={value}
      onChange={onChange}
    />
  );
};

export default UserSearch;
