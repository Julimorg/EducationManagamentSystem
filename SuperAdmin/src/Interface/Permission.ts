export type Permission ={
  permission_id: string;
  permission_name: string;
  description: string;
}


export type CreatePermission ={
    permission_name:string
    description:string
}

export type CreatePermissionRs ={
   stcod:string 
   msg:string
}

export  type EditPermission={
  permission_name:string
  description:string
}


