defmodule Bulls.Game do
    def new do 
        %{
            gameActive: false,
            users: [],
            players: [],
            readys: [],
            lastWinners: [],
            target: 0,
            guesses: [],
            nextGuesses: []
        }
    end
    
    def newGame(st) do
        %{ st |
          gameActive: true,
          target: random_num(),
          guesses: [],
          nextGuesses: []
        }
    end

    def guess(st, user, guess) do
        %{
            st | nextGuesses = st.nextGuesses ++ [newGuess(st, user, guess)]
        }
    end

    def newGuess(st, user, guess) do
        %{
            name: user,
            guess: guess,
            eval: check(String.graphemes(guess), String.graphemes(st.target), 0, [], []),
        }
    end

    def check(guess, str, index, bulls, cows) do
        if(index < Enum.count(guess)) do
            l1 = Enum.at(guess, index)
            c1 = Enum.at(str, index)
            cond do
                l1 == c1 -> 
                    check(guess, str, index + 1, [1 | bulls], cows)
                Enum.member?(str, l1) -> 
                    check(guess, str, index + 1, bulls, [1 | cows])
                true -> 
                    check(guess, str, index + 1, bulls, cows)
            end
        else
            {bulls, cows}
        end
    end
    
    def newUser(st, name) do
        %{ st |
            users: st.users ++ [%{ name: name, wins: 0, losses: 0,}],
        }
    end

    def player(st, userName, playerBool) do
        IO.inspect st
        %{st | players: updatePlayers(st, userName, playerBool)}
    end
    def updatePlayers(st, userName, playerBool) do
        if playerBool do
            st.players ++ [userName]
        else
            List.delete(st.players, userName)
        end
    end

    def ready(st, userName, readyBool) do
        %{st | readys: updateReadys(st, userName, readyBool)}
    end
    def updateReadys(st, userName, readyBool) do
        if readyBool do
            st.readys ++ [userName]
        else
            List.delete(st.readys, userName)
        end
    end

    def afterGame(st, winners) do
        %{
            gameActive: false,
            users: updateScoreboard(st, winners),
            players: [],
            readys: [],
            lastWinners: winners,
        }
    end
    def updateScoreboard(st, winners) do
        updateUser(st.users, st.players, winners, 0)
    end
    def updateUser(users, players, winners, i) do
        cond do
            i >= Enum.count(players) ->
                users
            Enum.member?(winners, Enum.at(players, i)) ->
                users
                |> addWinToUser(Enum.at(players, i))
                |> updateUser(players, winners, i + 1)
            true ->
                users
                |> addLossToUser(Enum.at(players, i))
                |> updateUser(players, winners, i + 1)
        end
    end
    def addWinToUser(users, name) do
        index = Enum.find_index(users, fn x -> Map.get(x, :name)===name end)
        user = Enum.find(users, fn x -> Map.get(x, :name)===name end)
        List.replace_at(users, index, %{ user | wins: user.wins + 1 })
    end
    def addLossToUser(users, name) do
        index = Enum.find_index(users, fn x -> Map.get(x, :name)===name end)
        user = Enum.find(users, fn x -> Map.get(x, :name)===name end)
        List.replace_at(users, index, %{ user | losses: user.losses + 1 })
    end

    def getWinners(st, winners, index) do
        if (index < Enum.count(st.nextGuesses)) do
            indexEval = Enum.at(st.nextGuesses, index).eval
            cond do
                Enum.count(indexEval.bulls) == 4 ->
                    getWinners(st, [winners | indexEval.name], index + 1)
                true ->
                    getWinners(st, winners, index + 1)
            end
        else
            winners
        end
    end

    def view(st, user) do
        if st.gameActive == true do
            if (Enum.count(st.nextGuesses) == Enum.count(st.players)) do
                if (Enum.count(getWinners(st, [], 0)) > 0) do
                    afterGame(st, getWinners(st, 0))
                else
                    %{
                        guesses: st.nextGuesses,
                        nextGuesses: [],
                        gameActive: st.gameActive
                    }
                end
            else
                %{
                    guesses: st.guesses,
                    gameActive: st.gameActive
                }
            end
        else
            %{
                users: st.users,
                players: st.players,
                readys: st.readys,
                lastWinners: st.lastWinners,
            }  
        end
    end

    def random_num do
        Enum.join(Enum.take(Enum.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 4));
    end
end
