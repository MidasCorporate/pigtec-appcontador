export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('@pigtek:token')
}
