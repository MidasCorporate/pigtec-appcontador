"use client"

import { useState } from "react"

export function useEditFarmRoleLinks() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<{
    id: string
    name: string
  } | null>(null)

  const openModal = (roleId: string, roleName: string) => {
    setSelectedRole({ id: roleId, name: roleName })
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedRole(null)
  }

  return {
    isOpen,
    selectedRole,
    openModal,
    closeModal,
  }
}
