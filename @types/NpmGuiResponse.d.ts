declare namespace NpmGuiResponse {
  interface Explorer {
    ls: Explorer.FileOrFolder[],
    path: string,
    changed: boolean;
  }
}
