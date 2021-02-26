defmodule Bulls.Game do
    def new do 
        %{
            gameActive: false,
            users: [],
            players: [],
            readys: [],
            lastWinners: [],
        }
    end
    
    def newGame(st) do
        %{ st |
          gameActive: true,
          target: random_num(),
          guesses: [],
        }
    end

    def guess(st, guess) do
        IO.inspect st
        IO.inspect guess
        cond do
            st.gameActive == false ->
                st
            Enum.count(st.guesses) >= 8 ->
                %{st | gameActive: false}
            guess == st.target -> 
                %{st | guesses: st.guesses ++ [guess], gameActive: false}
            true -> 
                %{st | guesses: st.guesses ++ [guess]}
        end
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
            userName: name,
            users: st.users ++ [%{ name: name, wins: 0, losses: 0,}],
        }
    end

    def player(st, playerBool) do
        %{st | players: updatePlayers(st, playerBool)}
    end
    def updatePlayers(st, playerBool) do
        if playerBool do
            st.players ++ [st.userName]
        else
            List.delete(st.players, st.userName)
        end
    end

    def ready(st, readyBool) do
        %{st | readys: updateReadys(st, readyBool)}
    end
    def updateReadys(st, readyBool) do
        if readyBool do
            st.readys ++ [st.userName]
        else
            List.delete(st.readys, st.userName)
        end
    end

    def afterGame(st, winners) do
        %{
            userName: st.userName,
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

    def viewSetup(st) do
        %{
            userName: st.userName,
            users: st.users,
            players: st.players,
            readys: st.readys,
            lastWinners: st.lastWinners,
        }  
    end

    def view(st, user) do
        if st.gameActive == true do
            num = st.target
            guess = Enum.at(st.guesses, Enum.count(st.guesses) - 1)
            checkList = String.graphemes(num)
            bulls = []
            cows = []
            if !Enum.empty?(st.guesses) do
                IO.inspect checkList
                IO.inspect guess
                {bulls, cows} = check(String.graphemes(guess), String.graphemes(num), 0, bulls, cows)
                %{
                    bullCow: %{
                        bull: Enum.count(bulls),
                        cow: Enum.count(cows)
                    },
                    guesses: st.guesses,
                    gameActive: true,
                    name: user
                }
            else
                %{
                    bullCow: %{
                        bull: Enum.count(bulls),
                        cow: Enum.count(cows)
                    },
                    guesses: st.guesses,
                    gameActive: true,
                    name: user
                }
            end
        else
            %{
                bullCow: %{
                    bull: 4,
                    cow: 0
                },
                guesses: st.guesses,
                gameActive: false,
                name: user
            }
        end
    end

    def random_num do
        Enum.join(Enum.take(Enum.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 4));
    end
end
