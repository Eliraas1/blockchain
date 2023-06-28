// Define a type for the slice state
export interface UserState {
    _id?: string;
    name?: string;
    email?: string;
    password?: string;
    isSignIn?: boolean;
    img?: string;
    contracts?: UserContracts;
    token?: string;
    emailFromRegister?: string;
  }
  export interface UserContracts {
    receive: ContractState[];
    sending: ContractState[];
  }
  export interface ContractState {
    _id?: string;
    carBrand?: string;
    done?: boolean;
    confirm?: boolean;
    expires?: string;
    from?: UserState;
    to?: UserState;
    decline?: boolean;
  }