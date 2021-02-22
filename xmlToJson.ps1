    [CmdletBinding()]
    param(
        [String] $in = "data\SANDBOX_0_0_0_.sbs"
    )
    Write-Host $in

    $date = Get-Date -Format "yyy-MM-dd_HH-mm"
    $outPath = "."
    [xml]$xml = Get-Content -Raw $in

    function position
    {
        param([System.Xml.XmlElement] $node)
        $pos = $node.PositionAndOrientation.Position
        @{ x = $pos.x; y = $pos.y; z = $pos.z }
    }
    function color
    {
        param([System.Xml.XmlElement] $node)
        "{0:x}" -f (((($node | Select x) * 256 + ($node | Select y)) * 256 + ($node | Select z)) *256)
    }

    function planetDetails
    {
        param([System.Xml.XmlElement] $node)
        @{
            id = $node.EntityId
            name = $node.name
            type = If ($node.radius -gt 20000)
            {
                "planet"
            }
            Else
            {
                "moon"
            }
            radius = $node.radius
            color = '#CC3333'
            position = $( position($node) )
            satellites = @()
        }
    }
    function gridDetails
    {
        param([System.Xml.XmlElement] $node)
        @{
            id = $node.EntityId
            name = $node.DisplayName
            type = $node.GridSizeEnum
            static = $node.IsStatic
            size = $node.CubeBlocks.MyObjectBuilder_CubeBlock.count
            position = $( position($node) )
        }
    }
    function asteroidDetails
    {
        param([System.Xml.XmlElement] $node)
        @{
            id = $node.EntityId
            position = $( position($node) )
        }
    }
    function safezoneDetails
    {
        param([System.Xml.XmlElement] $node)
        @{
            id = $node.EntityId
            position = $( position($node) )
            size = @{ x = $node.size.x; y = $node.size.y; z = $node.size.z }
            format = 'sphere'
            color = $( color($node.ModelColor) )
        }
    }

    $config = @{
        spaceMaxSize = 10000;
        offsets = @{ planet = 131072; moon = 16384 };
        system = @();
    }
    $asteroids = @();
    $structures = @();
    $safezones = @();


    # interate throught entities
    foreach ($entity in  $xml.MyObjectBuilder_Sector.SectorObjects.MyObjectBuilder_EntityBase)
    {
        switch ($entity.type)
        {
            "MyObjectBuilder_Planet"   {
                $config.system += $( planetDetails($entity) )
            }
            "MyObjectBuilder_CubeGrid" {
                $structures += $( gridDetails($entity) )
            }
            "MyObjectBuilder_VoxelMap" {
                $asteroids += $( asteroidDetails($entity) )
            }
            "MyObjectBuilder_SafeZone" {
                $safezones += $( safezoneDetails($entity) )
            }
        }
    }
    $struct = @{ config = $config; asteroids = $asteroids; structures = $structures; safezones = $safezones }
    $struct | ConvertTo-Json -Depth 20 | Set-Content "$outPath\$( $date )_map-data.json"


