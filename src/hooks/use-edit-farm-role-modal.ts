"use client"

import { useState } from "react"

interface EditModalState {
  isOpen: boolean
  roleId: string | null
  roleName: string | null
  preSelectedFarmIds?: string[]
}

export function useEditFarmRoleModal() {
  const [modalState, setModalState] = useState<EditModalState>({
    isOpen: false,
    roleId: null,
    roleName: null,
    preSelectedFarmIds: undefined,
  })

  const openModal = (roleId: string, roleName: string, preSelectedFarmIds?: string[]) => {
    setModalState({
      isOpen: true,
      roleId,
      roleName,
      preSelectedFarmIds,
    })
  }

  const closeModal = () => {
    setModalState({
      isOpen: false,
      roleId: null,
      roleName: null,
      preSelectedFarmIds: undefined,
    })
  }

  return {
    modalState,
    openModal,
    closeModal,
  }
}
