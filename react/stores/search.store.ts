import { observable, action } from 'mobx';
import axios from 'axios';

export class SearchStore {
  @observable results: any[] = [];

  @action
  async fetchSearch(query: string, repo:Dependency.Repo): Promise<void> {
    const responseSimple = await axios.post(`/api/search/${repo}`, { query });

    this.setResults(responseSimple.data);
  }

  @action
  setResults(results: any): void {
    this.results = results;
  }
}

export const searchStore = new SearchStore();
