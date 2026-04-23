export type CreateOrgRequest = {
  org_name: string;
  description: string;
  is_Active: boolean;
  start: string;     
  end: string; 
};
export type GetOrg = {
  Id: string;           
  org_name: string;     
  description: string;  
  is_Active: boolean;  
};

export type UpdateOrg = {
  start: string;     
  end: string;  
  status: boolean;  
};

export type DeleteOrgRs={
  stcode:string;
  msg:string
}
