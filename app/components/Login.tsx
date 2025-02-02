'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LoginProps {
    setIsLoggedIn: (value: boolean) => void
    setUserData: (data: any) => void
}

export default function Login({ setIsLoggedIn, setUserData }: LoginProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })

            if (response.ok) {
                const data = await response.json()
                localStorage.setItem('userId', data.userId.toString())
                localStorage.setItem('nickname', data.nickname)
                localStorage.setItem('workspaces', JSON.stringify(data.workspaces))
                setUserData(data)
                setIsLoggedIn(true)
                router.push('/')
            } else {
                const errorData = await response.json()
                setError(errorData.message || 'Login failed')
            }
        } catch (error) {
            setError('An error occurred. Please try again.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-4 rounded-b-2xl items-center">
            <h1 className={"text-white"}>Enter your account:</h1>
            <div className={"text-white"}>
                <label htmlFor="username" className="block text-sm font-medium text-gray-400">Username</label>
                <Input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className={"bg-gray-700"}>Enter</Button>
        </form>
    )
}