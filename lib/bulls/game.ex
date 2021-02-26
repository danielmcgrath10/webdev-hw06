defmodule Bulls.Game do
    def new do 
        %{
          target: random_num(),
          guesses: [],
          gameActive: true
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