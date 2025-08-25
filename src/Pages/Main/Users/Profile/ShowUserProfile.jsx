import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'
import { FetchOneUser } from '../../../../Api/Main/Users/FetchOneUser';

export default function ShowUserProfile() {
  const {id}=useParams();
    const [user, setUser] = useState({});
    const [loadingUser, setLoadingUser] = useState(true);
    const { t } = useTranslation();
    
    useEffect(() => {
        const fetchUser = async () => {
          setLoadingUser(true);
          try {
            const result = await FetchOneUser({player_id:id});
            if (result?.data) {
              console.log("User", result.data.player);
              setUser(result.data?.player || {});
            }
          } catch (error) {
            console.error("Failed to fetch user:", error);
          } finally {
            setLoadingUser(false);
          }
        };
        fetchUser();
      }, []);
  return (
    <div>
      
    </div>
  )
}
