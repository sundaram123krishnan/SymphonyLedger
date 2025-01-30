import { Music, Mic, Radio } from "lucide-react"

const spotifyData = {
    mostPlayedSongs: [
        { name: "Song 1", artist: "Artist A", plays: 150 },
        { name: "Song 2", artist: "Artist B", plays: 130 },
        { name: "Song 3", artist: "Artist C", plays: 120 },
        { name: "Song 4", artist: "Artist D", plays: 110 },
        { name: "Song 5", artist: "Artist E", plays: 100 },
    ],
    topSongs: [
        { name: "Top Song 1", artist: "Artist X" },
        { name: "Top Song 2", artist: "Artist Y" },
        { name: "Top Song 3", artist: "Artist Z" },
    ],
    topArtists: ["Artist X", "Artist Y", "Artist Z"],
    topGenres: ["Pop", "Rock", "Hip-Hop"],
}

export default function SpotifyWrapped() {
    return (
        <div className="min-h-screen bg-background text-white p-8">
            <h1 className="text-4xl font-bold text-center mb-12 text-green-400">Your 2025 Wrapped</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Most Played Songs */}
                <div className="bg-black p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-green-400">Most Played Songs</h2>
                    <ul>
                        {spotifyData.mostPlayedSongs.map((song, index) => (
                            <li key={index} className="mb-2 flex justify-between items-center">
                                <span>
                                    {song.name} - {song.artist}
                                </span>
                                <span className="text-green-400">{song.plays} plays</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Top 3 Songs */}
                <div className="bg-black p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-400">Top 3 Songs</h2>
                    <ul>
                        {spotifyData.topSongs.map((song, index) => (
                            <li key={index} className="mb-4 flex items-center">
                                <Music className="mr-2 text-purple-400" />
                                <span>
                                    {song.name} - {song.artist}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Top 3 Favorite Artists */}
                <div className="bg-black p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-pink-400">Top 3 Favorite Artists</h2>
                    <ul>
                        {spotifyData.topArtists.map((artist, index) => (
                            <li key={index} className="mb-4 flex items-center">
                                <Mic className="mr-2 text-pink-400" />
                                <span>{artist}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Top 3 Genres */}
                <div className="bg-black p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Top 3 Genres</h2>
                    <ul>
                        {spotifyData.topGenres.map((genre, index) => (
                            <li key={index} className="mb-4 flex items-center">
                                <Radio className="mr-2 text-yellow-400" />
                                <span>{genre}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}