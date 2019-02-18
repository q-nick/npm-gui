interface ConsoleSession {
  id: string;
  status: 'NEW' | 'ERROR' | 'CLOSE' | 'LIVE';
  msg: string;
}
