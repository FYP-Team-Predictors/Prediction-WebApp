import Head from 'next/head'
import styles from '../styles/SearchHomeView.module.css'
import SearchHomeView from "@/pages/home";

export default function Home() {
    return (
        <main>
            <div>
                <SearchHomeView />
            </div>
        </main>
    )
}