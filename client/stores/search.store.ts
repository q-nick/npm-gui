import { observable, action } from 'mobx';
import axios from 'axios';

export class SearchStore {
  @observable results: Dependency.SearchResult[] = [];

  @action
  async fetchSearch(query: string, repo:Dependency.Repo): Promise<void> {
    this.setResults(undefined);

    const responseSimple = await axios.post(`/api/search/${repo}`, { query });

    this.setResults(responseSimple.data);
  }

  @action
  setResults(results: Dependency.SearchResult[]): void {
    this.results = results;
  }
}

export const searchStore = new SearchStore();
