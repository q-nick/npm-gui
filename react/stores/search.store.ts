import { observable } from 'mobx';

export class SearchStore {
  @observable searchQuery: string;
  @observable searchResults: any[] = [];
}

export const searchStore = new SearchStore();
