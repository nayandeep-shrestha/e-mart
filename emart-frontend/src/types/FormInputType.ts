import { PropsWithChildren } from 'react';

export interface FormInputType extends PropsWithChildren {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  className: string;
  required?: true;
}
