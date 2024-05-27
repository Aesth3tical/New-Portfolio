from discord import Interaction, SelectOption, Embed, Color
from discord.ui import Select, View
from discord.ext import commands

options = [
    SelectOption(label='General', value='1046044856549654599'),
    SelectOption(label='Reports', value='1067860625805541376'),
    SelectOption(label='Staff Applications', value='1074397504919048254')
]

class CategorySelect(Select):
    def __init__(self):
        super().__init__(placeholder='Select a category', options=options)

class Advanced_Menu(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_thread_ready(self, thread, creator, category, initial_message):
        global thread_channel
        thread_channel = thread.channel.id
        print('Hi')
        menu = View()
        menu.add_item(CategorySelect())
        embed = Embed(title='Welcome to the support channel', description='Please select a category', color=Color.green())
        await thread.recipient.send(view=menu, embed=embed)
        embed2 = Embed(title="Category Prompted", description=f"Prompted {thread.recipient.mention} to select a category", color=Color.green())
        await self.bot.get_channel(thread_channel).send(embed=embed2)
     
    @commands.Cog.listener()
    async def on_interaction(self, interaction: Interaction):
        selected = interaction.data['values'][0]
        embed = Embed(title='Category selected', description=f'Transferring you to {self.bot.get_channel(int(selected)).name}', color=Color.green())
        await interaction.response.send_message(embed=embed)

        # send message to thread channel
        thread = self.bot.get_channel(thread_channel)
        selection = self.bot.get_channel(int(selected))
        await thread.send(embed=embed)
        await thread.edit(category=self.bot.get_channel(int(selected)))

async def setup(bot):
    await bot.add_cog(Advanced_Menu(bot))
