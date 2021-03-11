import { createAction } from '@ngrx/store';

export const isLoading = createAction('[Ui Component] Is Loading');

export const stopLoading = createAction('[Ui Component] Stop Loading');
