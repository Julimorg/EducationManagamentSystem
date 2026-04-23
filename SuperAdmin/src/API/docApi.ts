import axiosClient from '@/API/axiosClient';
import type { CreateOrgRequest, DeleteOrgRs, GetOrg } from '@/Interface/TOrg';
import type { Login, LoginResponseTokenData } from '@/Interface/Login';
import type { CreatePermission, CreatePermissionRs, EditPermission, Permission} from '@/Interface/Permission';
import type { LanguageResponse } from '@/Interface/TLanguage';
import type { CreateAdmin, CreateAdminRs } from '@/Interface/TCreateAdmin';

/*--------------------------------------Get all permission-------------------------------------------------------------- */
export const docApi = {
      Login: async (body: Login): Promise<LoginResponseTokenData> => {
    const url = `/account/log-in`;
    const res = await axiosClient.post(url, body);
    return res.data;
  },
   /*--------------------------------------PostOder---------------------------------------------------------------- */
    getLanguage:async ():Promise<LanguageResponse>=>{
      const url = `/language `
      const res = await axiosClient.get<LanguageResponse>(url);
      return res.data
    },

getAllPermission:async():Promise<Permission[]>=>{
  const url =`permission/get-all`
  const res= await axiosClient.get(url)
  return res.data
},
/*--------------------------------------Createpermission-------------------------------------------------------------- */
createPermission:async(body:CreatePermission):Promise<CreatePermissionRs>=>{
  const url =`permission/create`
  const res = await axiosClient.post(url,body)
  return res.data
},

/*--------------------------------------edit permission -------------------------------------------------------------- */
  EditPermission:async(permission_id:string,body:EditPermission):Promise<CreatePermissionRs>=>{
    const url =`permission/${permission_id}`
    const res=await axiosClient.patch(url , body)
    return res.data

  },
  /*--------------------------------------change-status permission -------------------------------------------------------------- */
  ChangeStatus:async(permission_id:string):Promise<CreatePermissionRs>=>{
    const url =`permission/change-status/${permission_id}`
    const res=await axiosClient.patch(url )
    return res.data

  },
/*--------------------------------------Create Org Module--------------------------------------------------------------- */
  CreateOrg: async (body: CreateOrgRequest): Promise<CreateOrgRequest> => {
    const url = 'org/create-org';
    const res = await axiosClient.post(url, body);
    return res.data;
  },

  /*--------------------------------------Get Org Module--------------------------------------------------------------- */

  GetOrg: async (): Promise<GetOrg[]> => {
    const url = '/org';
    const res = await axiosClient.get(url);
    return res.data.data;
  },
  /*--------------------------------------Update Org Module--------------------------------------------------------------- */

  /*--------------------------------------Create ADmin--------------------------------------------------------------- */
    CreateAdmin: async(body:CreateAdmin):Promise<CreateAdminRs>=>{
      const url =`account/create-admin`;
      const res = await axiosClient.post(url,body)
      return res.data
    },
   /*--------------------------------------Delete Org--------------------------------------------------------------- */
    DeleteOrg: async(id:string):Promise<DeleteOrgRs>=>{
      const url =`org/${id}`
      const res=await axiosClient.delete(url)
      return res.data
    }
}
