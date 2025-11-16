import asyncio

async def wait_for_unpause(recording_flag):
    while True:
        if recording_flag["recording"]:
            return
        await asyncio.sleep(1)